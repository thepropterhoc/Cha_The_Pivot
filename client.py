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

server = smtplib.SMTP('mail.gocha.io', 25, timeout=20000)
server.set_debuglevel(3)
server.sendmail('vanhooser@ou.edu', 'postmaster@gocha.io', 'this is a test message')
server.quit()