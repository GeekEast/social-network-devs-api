## Environment
- **Typescript**: Static Testing
- **Prettier**: format the code
- **Husky**: pre-commit hooks


## Architecture
- Services: **Connector**, in essence
- Model: **`External` Controller**, in essence
- Database: **`External` Resources**, in essence
![mvc](https://geekeaskblogpics.s3-ap-southeast-2.amazonaws.com/posts/WX20190829-144102.png)

### Controllers
- Request Body Validator
- Request Handler

### Middleware
- Root Router
- User Authenticator
- `express.json()`

### Models
- **Post**: Post Schema and model
- **Profile**: Profile Schema and model
- **User**: User Schema and model

### Routes
- **Auth**: **Login** and **R** of `authenticated user`
- **Post**: **CRUD** post, **UD** of comments and likes
- **Profile**: **CRUD** profile, **UD** of experiences and educations, **R** of Github Repo
- **User**: **C** of User

### Services
- **Github**: connect to Oauth Apps of github
- **MongoDB**: connect to MongoDB


## Questions
- Is lodash `set()` method happen in-place or not in-place?
  - in-place
- What's the difference between `post` and `put` method?
  - `post`: update a whole thing
  - `put`: update parts of a whole thing

## Reference
[Node MVC架构](https://div.io/topic/1061) | 
[Declaration](https://ts.xcatliu.com/basics/declaration-files) | 
[MDN Diagram of MVC on Node.js](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes) |
[Extend Express Request object using Typescript](https://stackoverflow.com/questions/37377731/extend-express-request-object-using-typescript) | 
[Declaration Merge](https://typescript.bootcss.com/declaration-merging.html) | 
[Non-null Assertion Operator](https://stackoverflow.com/questions/40349987/how-to-suppress-error-ts2533-object-is-possibly-null-or-undefined)
