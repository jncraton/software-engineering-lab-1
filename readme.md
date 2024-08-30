Software Engineering Lab 1
==========================

This lab gives you the opportunity to use basic `git` commands in a collaborative environment. If Git is a little rusty for you, I recommend using the [Git book](https://git-scm.com/book/en/v2) for reference.

Tasks
-----

### `clone` this repository. 

```
git clone git@github.com:jncraton/software-engineering-lab-1.git
```

You now have a local copy of this Git repository. This includes not just the current state of the code, but also the history of the code. Changes will be made to this local repository and combined with the upstream repository using a `push`

### Modify `contributors.md`

Modify the contributors.md file locally to add yourself to the list of contributors. 

`commit` this change using a [good commit message](https://archive.ph/zE4lu).

You have now added a new change to your local history of changes in your local repository. You can confirm this by running `git log`. You can also view your change by running `git diff HEAD~1` to show the difference between the head of the current branch and the previous commit.

`push` your change to the `main` branch on Github.

Note that when working collaboratively nearly all teams will avoid using the `main` branch in this way. We will use branches and pull requests in our next lab.

If you run into merge conflicts, feel free to attempt to resolve them. If you get stuck, we can talk more about how to get unstuck in class.

### Modify the application

- Open index.html locally and explore the game.
- Make one visible change to the game. This doesn't have to be a major change, but it can be.
- `commit` your change. You may use multiple commits and/or branches if desired, but a single commit is fine for this project.
- Test your change locally. We do not want to push a broken game to others.
- `push` your working change to Github.
- Observe that your change is reflected in the [deployed version of the game](https://jncraton.github.io/software-engineering-lab-1) after a minute or so.

