#!/bin/bash

# Blossom Byte Documentation Batch Converter
# Requires: pandoc and wkhtmltopdf installed on your system.
# sudo apt-get install pandoc wkhtmltopdf

echo "Converting Markdown files to PDF and DOCX..."

find ./docs -name "*.md" | while read file; do
    filename=$(basename "$file" .md)
    dir=$(dirname "$file")
    
    # Export to PDF
    pandoc "$file" -o "pdf/$filename.pdf" --pdf-engine=wkhtmltopdf
    echo "Generated pdf/$filename.pdf"
    
    # Export to DOCX
    pandoc "$file" -o "pdf/$filename.docx"
    echo "Generated pdf/$filename.docx"
done

echo "Batch conversion complete!"
