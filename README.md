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

## Questions
- Is lodash `set()` method happen in-place or not in-place?
  - in-place
- What's the difference between `post` and `put` method?
  - `post`: update a whole thing
  - `put`: update parts of a whole thing

## Reference
[Node MVC架构](https://div.io/topic/1061) | 
[Declaration](https://ts.xcatliu.com/basics/declaration-files) | 
[MDN Diagram of MVC on Node.js](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes)

## Random
COURSEWORK
◦ F19
• TA: 11-611 Natural Language Processing by Alan Black and David Mortensen
• 15-640 Distributed Systems by Yuvraj Agarwal and Dave Andersen
• 10-745 Scalability in Machine Learning by Barnabas Poczos
• 11-751 Speech Recognition and Understanding by Florian Metze and Ian Lane
• 11-755 Machine Learning for Signal Processing by Bhiksha Raj
◦ S19
• 10-707 Deep Learning by Ruslan Salakhutdinov
• 11-747 Neural Networks for NLP by Graham Neubig
• 11-797 Question Answering by Eric Nyberg & Teruko Mitamura
• 15-719 Advanced Cloud Computing by Greg Ganger, Majd Sakr & George Amvrosiadis
◦ F18
• 11-642 Search Engines by Jamie Callan
• 18-661 Machine Learning by Virgina Smith & Carlee Joe-Wong
• 18-600 Intro to Computer Systems by John Paul Shen & Saugata Ghose

ONLINE COURSES
• Machine Learning (@Coursera) by Andrew Ng
• Algorithms (@Coursera) by Robert Sedgewick & Kevin Wayne
• Natural Language Processing (@Columbia University) by Michael Collins