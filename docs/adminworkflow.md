## For those with administrative access only

### To get things from the upstream repository
```
git fetch upstream
git merge upstream/<branch>
```
To send things to the upstream repository
1. From command line
    ```git add .
    git commit -m "stuff" 
    git push origin <branch name>```
2. From your own repository's GitHub
    1. Create a pull reuqest to the upstream
3. From the upstream repository's GitHub
    1. Merge the pull request