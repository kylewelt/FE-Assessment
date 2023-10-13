# FE Assessment

We greatly value the time that you put into these assignments. The technical part of your next interview will build upon your submission.

This evaluation is intended to allow you to demonstrate practical Angular coding skills, including how you structure your solution. We value clean code that is easy to understand and extend. We also value test coverage where appropriate (Note: you should not try to cover the entire application with tests as part of this assessment).

When you have completed the challenge, please send an email to your recruiter with the link to your fork of the repository containing the completed assessment. They will ensure that it makes it back to us.


# Overview

In this challenge, you will be asked to update, refactor, or extend functionality in this application. This application manages a list of hospitals, their addresses, and their rating. There are 3 pages, a dashboard, a list/form (Hospitals), and a details view.

Instructions for each task can be found in this readme. Please use best practices when solving these tasks.

This challenge should take around an hour or so to complete, so please timebox your efforts. There is a bonus/extra task that you can complete if you have time or would like to.


# Startup

Fork the repo found here: https://github.com/AMADataLabs/FE-Assessment
Install the dependencies using `npm i`
If needed, install the Angular CLI `npm i -g @angular/cli`


# Task 1

In the Dashboard component, update the "Top Hospitals" list to sort the displayed hospitals in order of their rating (5 is high, 1 is low).


# Task 2

In the hospital-detail component, repair the "Address" display to show a correctly formatted address. Ex) 123 Main St, Chicago, IL 60606


# Task 3

In the hospital component, update the page to include address and rating input fields. When you click "Add hospital", all of this data should be propogated to the BE and stored.


# Task 4
In the Dashboard component, update the "Top Hospitals" list to display the icon, name, address, and rating for each of the top hospitals.


# Bonus Items
Add validation to the "Add Hospital" form to require a valid name and rating.
Update the rating system to display stars instead of numbers.
