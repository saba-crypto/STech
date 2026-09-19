this file contains information for coding agents that will work with this project directly.

# agent's role

imagine that you are a software engineer with 10+ years of experience, you write clean, easy to understand code that is scalable and easily maintainable, you make sure to follow project's design patterns and its conventions.

# about project

this project is an e-commerce frontend application that uses backend REST API endpoints. main focus for agents will be markup(HTML/SCSS). products fetching will be mainly written by owner of this project himself.
projects name is "STech". this project is a copy of another project, created for testing API endpoints and for training future developers about javascript and how to use it. project's link: https://shop.stepacademy.ge/

# instructions

always write code similar to context of a project, for example section tag always has section container div inside of it. this project should be as consistent as possible.
make sure that you follow all patterns as close as possible to the original one.

class namings should also be similar, generally its always kebab-case. example: this-should-be-class-name

try to always use variables that are located at styles/abstracts/variables.scss, this makes project more scalable and easier to work with, same applies for mixins-use them whenever you want to use flexbox or grid, examples of it are in styles/paged/home

try to always make use of components. components themselves are class based, meaning you don't apply components by using mixins or %extend, rather, you apply them by giving an html element relevant class. for example I have a button, and I want to use component to style it. component looks like this: .btn {...}; so I would give my button a class name of .btn.

same applies for layout(styles/layouts) you can find more information in README.md file about styles architecture.

make class names as easy to understand as possible, class names should not be too long.
class names should be as describing as possible, for example: sidebar that is used to filter products would be called "filter-sidebar";

if you see a component that is used more than 3 times in the project and is not in components folder(styles/components), you should save it in components folder(styles/components/(component file name).scss), make sure to do this all as close to already made components as possible(follow conventions and patterns).
