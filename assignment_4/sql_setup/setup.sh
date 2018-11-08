#!/bin/bash
psql "$DATABASE_URL" < /root/secure_login.sql
