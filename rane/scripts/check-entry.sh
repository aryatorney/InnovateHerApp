#!/bin/bash
curl -s http://localhost:3000/api/entries/2026-02-09 | python3 -m json.tool
