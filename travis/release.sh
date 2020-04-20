#!/usr/bin/env bash
set -e

if [ "$TRAVIS_BRANCH" = "$RELEASE_BRANCH" ]; then

  REMOTE_NAME="origin"
  POST_RELEASE_BRANCH="$POST_RELEASE_BRANCH"

  git remote rm $REMOTE_NAME

  echo "Setting remote url https://github.com/${TRAVIS_REPO_SLUG}.git"
  git remote add $REMOTE_NAME "https://${GITHUB_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git" > /dev/null 2>&1

  echo "Checking out $RELEASE_BRANCH as travis leaves the head detached."
  git checkout $RELEASE_BRANCH

  CURRENT_VERSION=$(npm run version --silent)

  echo "Current Version"
  echo "$CURRENT_VERSION"
  echo ""

  echo "Testing git remote"
  git branch -vv
  echo ""

  echo "Creating tag v$CURRENT_VERSION"
  git tag -fa "v$CURRENT_VERSION" -m "Releasing version $CURRENT_VERSION"

  echo "Increasing package version"
  npm version patch -m "Increasing version to %s" --git-tag-version false

  CURRENT_VERSION=$(npm run version --silent)

  echo "New Version"
  echo "$CURRENT_VERSION"
  echo ""

  git add .
  git commit -m "Creating new version $CURRENT_VERSION"

  echo "Pushing code to $REMOTE_NAME $POST_RELEASE_BRANCH"
  git push --set-upstream $REMOTE_NAME $RELEASE_BRANCH:$POST_RELEASE_BRANCH
  echo "Pushing tags to $REMOTE_NAME"
  git push --tags $REMOTE_NAME
else
  echo "Release is disabled"
fi
