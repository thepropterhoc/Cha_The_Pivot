import smtpd
import asyncore

server = smtpd.DebuggingServer(('127.0.0.1', 2525), None)

asyncore.loop()