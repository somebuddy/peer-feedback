/*global Assignments, Requirements */

Meteor.startup(function () {
  if (Assignments.find().count() === 0) {
    var a;

    a = Assignments.insert({
      title: 'Exploring Ionic Framework',
      score: 8.0,
      tags: ['Coursera', 'Angular', 'Ionic'],
      level: 1,
      rating: 5,
      description: 'In this assignment, you will update the Ionic app to add the "Contact Us" and "About Us" pages.',
      dueDate: new Date(2016, 0, 1)
    });

    Requirements.insert({
      assignment: a,
      title: 'You should create a card to display the address as shown in the image. The address information is provided in the text file Assignment1.txt above.',
      task: 1,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'You should show the three buttons for Call, Skype and Email as shown in the image above using the button bar.',
      task: 1,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'You should use the font icons supplied by Ionic framework to add the icons to the address and the buttons as shown above.',
      task: 1,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'You will use the card to display the history. The text for the history is provided in the resources above.',
      task: 2,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'The corporate leadership information is obtained from the server through the AboutController. The information about the leaders is displayed using a list-inset style list.',
      task: 2,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'The list items are configured using one of the list item styles. You need to look up the list item styles in the Ionic framework documentation and figure out which style is the most appropriate for this purpose, and then apply the style to the list items.',
      task: 2,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'You need to update the AboutController for it to be able to retrieve the information about the leadership from the server',
      task: 3,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'You need to update the app.aboutus state in the app.js file to use the controller.',
      task: 3,
      score: 1.0
    });

    a = Assignments.insert({
      title: 'Ionic Modals, Forms, Popovers',
      score: 10.0,
      tags: ['Coursera', 'Angular', 'Ionic'],
      level: 2,
      rating: 5,
      description: 'In this assignment, you will support a popover in the dishdetail.html template with two options. The first option will enable you to add the dish to your favorites. The second option will bring up a form within a modal that enables you to add your comments on the dish.',
      dueDate: new Date(2016, 1, 1)
    });

    Requirements.insert({
      assignment: a,
      title: 'Add a button to the header bar that when clicked will bring up a popover',
      task: 1,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'The popover should have two options: "Add to Favorites", and "Add Comment"',
      task: 1,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'The popover template should be defined in a file named dish-detail-popover.html',
      task: 1,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'Appropriate code is added to DishDetailController to support the popover.',
      task: 1,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'When the user clicks on the "Add to Favorites" option in the popover, then add the dish to the list of your favorite dishes.',
      task: 2,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'When the user clicks on the "Add Comment" option in the popover, bring up a modal containing the form that enables the user to add comments on the dish',
      task: 3,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'The form should contain three fields: Rating, Name and Comment. Use a Select element for the Rating, and a textarea for Comment fields.',
      task: 3,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'The form should be defined a template named dish-comment.html',
      task: 3,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'The modal is properly configured within DishDetailController',
      task: 3,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'When the user submits the comment, it should be added to the list of comments for the dish.',
      task: 3,
      score: 1.0
    });

    a = Assignments.insert({
        title: 'Resolve and Local Storage',
        score: 10.0,
        tags: ['Coursera', 'Angular', 'Ionic'],
        level: 3,
        rating: 5,
        description: 'In this assignment you will be concentrating on using ui-router\'s resolve object to update the app. In addition you will use the local storage to persist the information about the user\'s favorite dishes. ',
        dueDate: new Date(2016, 1, 1)
    });

    Requirements.insert({
      assignment: a,
      title: 'The app.home state has been updated to use resolve to ensure that the dish, promotions and leader information is available to the IndexController.',
      task: 1,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'The app.aboutus state has been updated to use resolve to ensure that the leaders information is available to the AboutController.',
      task: 1,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'The app.menu state has been updated to use resolve to ensure that the dishes information is available to the MenuController.',
      task: 1,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'The IndexController is updated to ensure that the dish, promotion and leader information is appropriately injected',
      task: 2,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'The code within the IndexController is updated to make use of the injected data.',
      task: 2,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'The AboutController is updated to ensure that the leaders information is appropriately injected',
      task: 2,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'The code within the AboutController is updated to make use of the injected data.',
      task: 2,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'The MenuController is updated to ensure that the dishes information is appropriately injected',
      task: 2,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'The code within the MenuController is updated to make use of the injected data.',
      task: 2,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'When the app first starts, the favorites information is initialized from local storage.',
      task: 3,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'Whenever the favorites is updated due to user\'s actions, the updates are persisted in the local storage',
      task: 3,
      score: 1.0
    });

    a = Assignments.insert({
        title: 'Cordova and ngCordova',
        score: 10.0,
        tags: ['Coursera', 'Angular', 'Ionic'],
        level: 3,
        rating: 5,
        description: 'The final assignment concentrates on Cordova plugins and ngCordova wrappers of these plugins. You can find the links to these plugins in teh additional resources.',
        dueDate: new Date(2016, 02, 01)
    });

    Requirements.insert({
      assignment: a,
      title: 'The registration page should now include a new button named Gallery below the Take Picture button.',
      task: 1,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'Clicking on the Gallery button should bring up the image gallery from which the user should be able to select a picture to include in the registration page',
      task: 1,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'The appropriate ngCordova wrapper service is properly injected in the AppCtrl controller',
      task: 1,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'When the user clicks on the Add To Favorites option in the Popover in the dish details page, a notification should be added to the notification bar with the information of the dish',
      task: 2,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'When the user clicks on the Add To Favorites option in the Popover in the dish details page, a toast message is shown at the bottom of the screen showing the details of the dish added to the favorites',
      task: 2,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'The appropriate ngCordova wrapper service is properly injected in the DishDetailController controller.',
      task: 2,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'The appropriate ngCordova wrapper service is properly injected in the FavoritesController controller.',
      task: 3,
      score: 1.0
    });

    Requirements.insert({
      assignment: a,
      title: 'The phone is vibrated when the user confirms that the item should be deleted.',
      task: 3,
      score: 1.0
    });
  }
})
