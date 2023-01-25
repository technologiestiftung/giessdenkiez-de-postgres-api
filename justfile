# docs https://github.com/casey/just
# justfile load .env file
set dotenv-load
set shell := ["bash", "-uc"]
alias t := generate-types

default:
    @just --list


generate-types:
    supabase gen types typescript --local > ./src/db-types.ts
