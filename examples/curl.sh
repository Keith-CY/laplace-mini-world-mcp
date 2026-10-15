#!/bin/sh
# Talk to the Laplace's Mini World MCP server with plain HTTP (JSON-RPC over Streamable HTTP).
# No key, no session: every request stands alone.
set -eu
URL=https://world.lapla.si/mcp
call() {
  curl -s "$URL" \
    -H 'Content-Type: application/json' \
    -H 'Accept: application/json, text/event-stream' \
    -H 'MCP-Protocol-Version: 2025-06-18' \
    -d "$1"
  echo
}

# The tools and their input schemas
call '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'

# Find plates about a topic (any language)
call '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"search_models","arguments":{"query":"潮汐","lang":"zh","limit":3}}}'

# A plate's chapters and lab settings
call '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"list_chapters","arguments":{"slug":"seasons","lang":"en"}}}'

# Show a model: open its laboratory, with the Sun's pull turned off
call '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"show_model","arguments":{"slug":"tides","lang":"en","lab":true,"params":{"sun":0}}}}'
