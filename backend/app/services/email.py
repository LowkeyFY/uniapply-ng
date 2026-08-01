def send_email(to: str, subject: str, body: str):
    """
    Sends an email. For now, just logs it — swap this function's body
    for a real provider (SendGrid, Mailgun, SES) later; nothing else
    in the app needs to change.
    """
    print(f"\n--- EMAIL ---\nTo: {to}\nSubject: {subject}\n\n{body}\n-------------\n")
