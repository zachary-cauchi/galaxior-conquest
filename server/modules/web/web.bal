
// Based on the works in the following article: https://medium.com/ballerina-techblog/implementing-a-simple-web-server-using-ballerina-8d180e041536
// Simple-esque http web server with no special bells and whistles.

import ballerina/file;
import ballerina/http;
import ballerina/log;
import ballerina/mime;

//// Configuration related properties.
configurable string serveDir = ?;
configurable int port = ?;

// Readonly version of mime_map structure for concurrency safety.
type mime_map readonly & map<string>;

// file extension mapping to content types.
final mime_map MIME_MAP = {
    "json": mime:APPLICATION_JSON,
    "xml": mime:TEXT_XML,
    balo: mime:APPLICATION_OCTET_STREAM,
    css: "text/css",
    gif: "image/gif",
    html: mime:TEXT_HTML,
    php: mime:TEXT_HTML,
    ico: "image/x-icon",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    js: "application/javascript",
    png: "image/png",
    svg: "image/svg+xml",
    txt: mime:TEXT_PLAIN,
    woff2: "font/woff2",
    zip: "application/zip"
};

# HTTP web server that serves files.
service / on new http:Listener(port) {
    # Main file endpoint. Serve web documents and static files.
    #
    # + paths - The components of the final path.
    # + caller - The caller object of the client.
    # + return - An error if `caller->respond` failed.
    isolated resource function get [string... paths](http:Caller caller) returns error? {
        http:Response res = new;
        string requestedFilePath = checkpanic file:joinPath(serveDir, ...paths);

        // If requested for a file(not directory), check if its available in the server and response.
        if (file:test(requestedFilePath, file:EXISTS) is true && isFile(requestedFilePath) is true) {
            res = getFileAsResponse(requestedFilePath);

            error? clientResponse = caller->respond(res);
            if clientResponse is error {
                log:printError("unable respond back", clientResponse);
            }
            return;
        }

        // If requested is a directory, change the resource to the index.html file in that directory.
        requestedFilePath = checkpanic file:joinPath(requestedFilePath, "index.html");

        // If the file exists, serve it.
        if file:test(requestedFilePath, file:EXISTS) is true {
            res = getFileAsResponse(requestedFilePath);
        }

        // Send the file to the client, checking if the response was successful.
        error? clientResponse = caller->respond(res);
        if clientResponse is error {
            log:printError("unable respond back", clientResponse);
        }

        return clientResponse;
    }
}

# Serve a file as a http response.
#
# + requestedFile - The path of the file to server.
# + return - The http response.
isolated function getFileAsResponse(string requestedFile) returns http:Response {
    http:Response res = new;

    // Figure out content-type
    string contentType = mime:APPLICATION_OCTET_STREAM;
    string fileExtension = getFileExtension(requestedFile);
    if fileExtension != "" {
        contentType = getMimeTypeByExtension(fileExtension);
    }

    // Check if file exists.
    if file:test(requestedFile, file:EXISTS) is true {
        res.setFileAsPayload(requestedFile, contentType = contentType);
    } else {
        log:printError("unable to find file: " + requestedFile);
        res.setTextPayload("the server was not able to find what you were looking for.");
        res.statusCode = http:STATUS_NOT_FOUND;
    }
    return res;
}

# Get the content type using a file extension.
#
# + extension - The file extension.
# + return - The content type if a match is found, else application/octet-stream.
isolated function getMimeTypeByExtension(string extension) returns string {
    var contentType = MIME_MAP[extension.toLowerAscii()];
    if contentType is string {
        return contentType;
    } else {
        return mime:APPLICATION_OCTET_STREAM;
    }
}

# Returns the extension of the given filename.
# This searches for the last '.' in the given string, and returns a substring starting from the character after the found '.'.
# Returns the full name if no '.' is found.
#
# + filename - The file name to search through.
# + return - The found file extension, or file name if no extension was identified.
isolated function getFileExtension(string filename) returns string {
    return filename.substring(filename.lastIndexOf(".") + 1 ?: 0);
}

# Check if a file path is a file and not a directory.
#
# + filePath - Path to the file
# + return - True if file, else false
isolated function isFile(string filePath) returns boolean|file:Error {
    return !(check file:test(filePath, file:IS_DIR) || check file:test(filePath, file:IS_SYMLINK));
}
