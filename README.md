## Environment


## Architecture
- Services: **Connector**, in essence
- Model: **`External` Controller**, in essence
- Database: **`External` Resources**, in essence
![mvc](https://geekeaskblogpics.s3-ap-southeast-2.amazonaws.com/posts/WX20190829-144102.png)

### Dabatase
- `MongoDB Atlas`: Cloud MongoDB for free

### Model
- `Mongoose`: Node Client to connect to Cloud MongoDB


### Routes
#### Middleware
- `express.json()`: parse req.body from string to json object


### Types
[Extend Express Request object using Typescript](https://stackoverflow.com/questions/37377731/extend-express-request-object-using-typescript) | 
[Declaration Merge](https://typescript.bootcss.com/declaration-merging.html) | 
[Non-null Assertion Operator](https://stackoverflow.com/questions/40349987/how-to-suppress-error-ts2533-object-is-possibly-null-or-undefined)

## Reference
[Node MVC架构](https://div.io/topic/1061) | 
[Declaration](https://ts.xcatliu.com/basics/declaration-files) | 
[MDN Diagram of MVC on Node.js](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes)