#!/bin/bash

# Betradar Automated Data Download & Processing System
# Cross-platform startup script (Linux/Mac)

echo "========================================"
echo "Betradar Automated Data Download & Processing System"
echo "========================================"
echo ""

# Execute main.js
node main.js

# Check execution result
if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "Execution successful!"
    echo "========================================"
else
    echo ""
    echo "========================================"
    echo "Execution failed!"
    echo "========================================"
    exit 1
fi
