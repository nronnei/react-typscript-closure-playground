# Playing with Closures in React and TypeScript
I wanted to learn more about how to use TypeScript with React. I also wanted a contrived example that easily showed how we can leverage closures to share state. So, I created this little repo to accomplish both.

## Setup
```
npm i
npm start
```
The app will now be running at `http://localhost:1234`.

Make sure to open your console to follow along!

## Notes
### We access shared state in 2 ways
1. A class declared within the closure which access the enclosed private variables
2. A instance of the class created within the closure

Both do the same job, but you interact with them differently. You have to instantiate the class before you can access the shared state, but you can just directly use the service. In the case of the service, *all state is shared.* In the case of the class, *some state is shared.* The IDs differ, but the message is shared. 

### Closure state != React state
Notice that `<Component1 />` never changes its message. It's stuck in time. The state continues to change within the closure, though, as demonstrated by the other components.