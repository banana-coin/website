#!/bin/bash
set -e  # Exit with non-zero if anything fails

BUILD_BRANCH="master"

# Do not build a new version if it is a pull-request or commit not to BUILD_BRANCH
if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "$BUILD_BRANCH" ]; then
    echo "Not $BUILD_BRANCH, skipping deploy;"
    exit 0
fi

HEAD_COMMIT=`git rev-parse --verify --short HEAD`
BANANA_REPO=`git config remote.origin.url`
BANANA_SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
BANANA_RAILS_REPO="git@github.com:adastreamer/bananacoin.git"
HEROKU_REPO_URL="git@heroku.com:bananacoinio.git"
BANANA_RAILS_NAME="bananacoin-rails"

echo "Prepare the key..."
# Encryption key is a key stored in travis itself
OUT_KEY="id_rsa"
echo "Trying to decrypt encoded key..."
openssl aes-256-cbc -k "$ENCRYPTION_KEY" -in deploy/id_rsa.enc -out $OUT_KEY -d -md sha256
chmod 600 $OUT_KEY
echo "Add decoded key to the ssh agent keystore"
eval `ssh-agent -s`
ssh-add $OUT_KEY

echo "Pull bananacoin rails repo"
pushd ..
git clone $BANANA_RAILS_REPO $BANANA_RAILS_NAME
echo "Return back to the website repo"
popd

echo "Build new data"
node_modules/gulp/bin/gulp.js
echo "Copy built data to the bananacoin rails repo"
mkdir -p ../$BANANA_RAILS_NAME/public/
cp -rf build/* ../$BANANA_RAILS_NAME/public/

public_dir="../$BANANA_RAILS_NAME/public/"
langs=( "" "ru" "kr" "jp" "cn" )
for ln in "${langs[@]}"
do
  new_dir="$public_dir/$ln"
  echo "DIR = $new_dir"
  cd "$new_dir"
  pwd
  rm index1.html
  cp index.html index1.html
  rm index.html
  cd -
done

echo "Add new data to the bananacoin repo git"
pushd ../$BANANA_RAILS_NAME
git config user.name "Travis CI"
git config user.email "$COMMIT_AUTHOR_EMAIL"

git add -A .
if ! [[ -z $(git status -s) ]] ; then
  echo "Pushing changes to the $BANANA_RAILS_REPO master branch"
  git commit -m "Add new build data from bananacoin website $HEAD_COMMIT commit"
  git push origin master
  echo "Add $HEROKU_REPO_URL as heroku remote"
  git remote add heroku $HEROKU_REPO_URL
  echo "Pushing to heroku remote..."
  export GIT_SSH_COMMAND="ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no"
  git push -q heroku $BUILD_BRANCH
  echo "All done."
else
  echo "There are no changes in result build, so nothing to push forward. End here."
  exit 0
fi

