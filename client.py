import smtplib

"""
def prompt(prompt):
    return raw_input(prompt).strip()

fromaddr = prompt("From: ")
toaddrs  = prompt("To: ").split()
print "Enter message, end with ^D (Unix) or ^Z (Windows):"

# Add the From: and To: headers at the start!
msg = ("From: %s\r\nTo: %s\r\n\r\n"
       % (fromaddr, ", ".join(toaddrs)))
while 1:
    try:
        line = raw_input()
    except EOFError:
        break
    if not line:
        break
    msg = msg + line

print "Message length is " + repr(len(msg))
"""

server = smtplib.SMTP('54.69.116.161', 1025)
server.set_debuglevel(1)
server.sendmail('vanhooser@ou.edu', 'shelbyvanhooser@yahoo.com', 'this is a test message')
server.quit()