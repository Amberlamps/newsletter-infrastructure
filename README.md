Rewriting "newsletter" to "newsletter-blog"
Deploy to a lot of regions

Part 1
- Frontend component in blog to sign up for newsletter
- Api endpoint for signing up POST https://newsletter.taskli.st/emails
  - Setting status to "subscribed"
- Infrastructure to deploy api and dynamodb db to different regions.
- Designing a dynamodb table that supports:
  - List of emails
  - Subscribe/unsubscribe

Part 2
- Development environment to create emails locally. Mjs files
  - newsletter/001.md
  - newsletter/002.md
- Sending out test emails
  - Creating test table for recipients
  - Upload 001.md to S3 bucketŸ
  - email: alexander.behrens@speakap.nl
  - bucket: newsletter-tasklist-blog
  - key: test/001.md

Part 3
- Storing secrets in secret manager for JWT
- Use JWT to encode email in base64
- Adding page at https://unsubscribe.taskli.st?app=blog&token=[TOKEN]
- Adding button to call DELETE
- Adding endpoint for users to unsubscribe DELETE https://newsletter.taskli.st/emails/[TOKEN]
  - Setting status to "unsubscribed"
- Redirect to https://blog.taskli.st

Part 4
- Add tracking (Google Analytics)

Part 5
- Sending out newsletter
  - Upload 001.md to S3 bucket
  - bucket: newsletter-tasklist-blog
  - key: production/001.md
- Function that queries all emails with status=subscribed
- Puts one record per entry in SQS queue
  - email
  - bucket
  - key

Part 6
- Automating newsletter
  - Automatically creating 001.md
- Making sure that no posts was send out twice


pk                sk                              lsi1
blog              alexander.behrens@speakap.nl    subscribed
APP               blog

newsletter    recipient                     status
001           alexander.behrens@speakap.nl  successful