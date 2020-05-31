# loopback4-microservice-catalog

## Contributing

First off, thank you for considering contributing to the project. It's people like you that helps in keeping this extension useful.

### Where do I go from here ?

If you've noticed a bug or have a question, [search the issue tracker](https://github.com/sourcefuse/loopback4-microservice-catalog/issues) to see if
someone else in the community has already created a ticket. If not, go ahead and
[make one](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/new/choose)!

### Fork & create a branch

If this is something you think you can fix, then [fork](https://help.github.com/articles/fork-a-repo) this repo and
create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):

```sh
git checkout -b 325-add-new-feature
```

### Make a Pull Request

At this point, you should switch back to your master branch and make sure it's
up to date with loopback4-microservice-catalog's master branch:

```sh
git remote add upstream git@github.com:sourcefuse/loopback4-microservice-catalog.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```sh
git checkout 325-add-new-feature
git rebase master
git push --set-upstream origin 325-add-new-feature
```

Finally, go to GitHub and [make a Pull Request](https://help.github.com/articles/creating-a-pull-request).

### Keeping your Pull Request updated

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code
has changed, and that you need to update your branch so it's easier to merge.

To learn more about rebasing in Git, there are a lot of [good][git rebasing]
[resources][interactive rebase] but here's the suggested workflow:

```sh
git checkout 325-add-new-feature
git pull --rebase upstream master
git push --force-with-lease 325-add-new-feature
```

[git rebasing]: http://git-scm.com/book/en/Git-Branching-Rebasing
[interactive rebase]: https://help.github.com/articles/interactive-rebase
