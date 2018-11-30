## How to configure git
### Configuring your name and email address
    git config --global user.name "My Name"
    git config --global user.email "yankun@ulaidao.com"
### Configuring the mail sending options
    git config --global sendemail.smtpencryption ssl
    git config --global sendemail.smtpserver smtp.exmail.qq.com
    git config --global sendemail.smtpuser yankun@ulaidao.com
    git config --global sendemail.smtpserverport 465
    git config --global sendemail.smtppass xxxx
### Configuring the default destination address
    git config --global sendemail.to yankun@ulaidao.com

## Sending a Single Patch
    git send-email -1
