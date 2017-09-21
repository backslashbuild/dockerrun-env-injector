# dockerrun-env-injector

This is a CLI tool for creating a Dockerrun.aws.json from a template and a .env file.

The intended use case is that you commit your Dockerrun.aws.template.json to your repo, and then use this tool during CI to create the Dockerrun.aws.json before deploying to Elasticbeanstalk. This allows you to keep sensitive environment variables such as database passwords out of source control, but also keep your non-sensitive configuration within your template.