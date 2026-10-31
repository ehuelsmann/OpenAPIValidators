
# Release procedure

This file documents the steps to execute to release from this repository.

1. Clone the repository
2. Create the release branch  
   `git checkout -b release-v<version>`  
   where `<version>` is the version to release, e.g. `0.19.2`
3. Run `yarn run version:bump <version>`
4. Run `yarn install`
5. Commit the changes  
   `git commit -am "Release v<version>"`
6. Tag the release  
   `git tag v<version>`
7. Push the branch and tag  
   `git push origin release-v<version v<version>`
8. Open a PR against `ehuelsmann/OpenAPIValidators`
9. Merge PR when testing completes successfully


A variant of the above, when using docker locally to run the latest NodeJS:

```dockerfile
# Dockerfile
FROM node:26

RUN corepack enable
```

Instead of running:

```plain
yarn run version:bump <version>
yarn install
```

Run:

```plain
docker run --rm -v $PWD:/project node:latest bash -c 'cd /project ; yarn run version:bump 0.19.2'
docker run --rm -v $PWD:/project node:latest bash -c 'cd /project ; yarn install'
```
