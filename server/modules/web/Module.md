A simple HTTP file server running at the root path.
[//]: # (above is the module summary)

# Module Overview
Listens to all uri paths to the configured port and serves files via HTTP to that path. Any requests made are handled by the service. The service must be configured from a `Config.toml` file with the following data:
```toml
[server.web]
# Path to root server folder eg. "../www"
serveDir = "<path-to-root-files-dir>"
# Port to listen on eg. 8080
port = 1234
```
