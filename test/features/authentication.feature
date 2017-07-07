Feature: Authentication
    User should be able to register and login
    It should be possible to toggle authentication
    It should be possible to toggle providers
    It should be possible to login using a provider
    It should be possible to register using an email address and a password
    It should be possible to login using an email address and a password
    It should be possible to change your password

    @mobile @tablet @desktop
    Scenario: Userbadge is not present in the menu if authentication is turned off
        Given I set the configLocation to "./fixtures/config/default.json"
        And I go to the "index" page
        Then the userbadge should not be visible

    @mobile @tablet @desktop
    Scenario: Userbadge is present in the menu if authentication is turned on
        Given I set the configLocation to "./fixtures/config/authentication.json"
        When I go to the "index" page
        Then the userbadge should be visible

    @mobile @tablet @desktop
    Scenario: Login modal becomes visible if I click on the userbadge
        Given I am still on the "index" page
        When I click on the userbadge
        Then the login modal should be visible

    @mobile @tablet @desktop
    Scenario: Login modal has all elements present when opened
        Given I am still on the "index" page
        And the login modal is visible
        Then the modal title should be "Log in"
        And a "facebook" provider button is present
        And a "github" provider button is present
        And a "twitter" provider button is present
        And a "google" provider button is present
        And a "email" input field is present
        And a "password" input field is present
        And a "login" button is present
        And a "signup" button is present

    @mobile @tablet @desktop
    Scenario: Signup modal becomes visible if I click the signup button
        Given I am still on the "index" page
        And the login modal is visible
        When I click on the "signup" button
        Then the signup modal should be visible

    @mobile @tablet @desktop
    Scenario: Signup modal has all elements present when opened
        Given I am still on the "index" page
        And the signup modal is visible
        Then the modal title should be "Sign up"
        And a "email" input field is present
        And a "password" input field is present
        And a "terms" checkbox is present
        And a "signup" button is present

    @mobile @tablet @desktop
    Scenario: Signup modal email input shows required errors when nothing is entered
        Given I am still on the "index" page
        And the signup modal is visible
        When I focus on the "email" input
        And I enter "test" in the "email" input
        And I remove everything in the "email" input
        And I focus on the "password" input
        Then a warning should be visible with the text "Warning: An email address is required to sign up"

    @mobile @tablet @desktop
    Scenario: Signup modal email input shows required errors when invalid email is entered
        Given I am still on the "index" page
        And the signup modal is visible
        When I focus on the "email" input
        And I enter "test" in the "email" input
        And I focus on the "password" input
        Then a warning should be visible with the text "Warning: The email address is not a valid email address"


    @mobile @tablet @desktop
    Scenario: Signup modal password input shows required errors when nothing is entered
        Given I am still on the "index" page
        And the signup modal is visible
        When I focus on the "email" input
        And I enter "test@test.com" in the "email" input
        And I focus on the "password" input
        And I enter "test" in the "password" input
        And I remove everything in the "password" input
        And I focus on the "email" input
        Then a warning should be visible with the text "Warning: A password is required to sign up"

    @mobile @tablet @desktop
    Scenario: Signup modal passwordconfirm input shows errors if password are not the same
        Given I am still on the "index" page
        And the signup modal is visible
        When I focus on the "password" input
        And I enter "thisisatest" in the "password" input
        And I focus on the "passwordconfirm" input
        And I enter "thisisnotthesame" in the "passwordconfirm" input
        Then a warning should be visible with the text "Warning: Passwords don't match"

    @mobile @tablet @desktop
    Scenario: Signup modal submit is not disabled if there are no errors
        Given I am still on the "index" page
        And the signup modal is visible
        When I focus on the "email" input
        And I remove everything in the "email" input
        And I enter "test@test.nl" in the "email" input
        And I focus on the "password" input
        And I remove everything in the "password" input
        And I enter "thisisapassword" in the "password" input
        And I focus on the "passwordconfirm" input
        And I remove everything in the "passwordconfirm" input
        And I enter "thisisapassword" in the "passwordconfirm" input
        And I click on the terms checkbox
        Then The "signup" button should be not disabled


    @mobile @tablet @desktop
        Scenario: Signup is completed and confirmation alert is shown
            Given I am still on the "index" page
            And the signup modal is visible
            When I click the signup button
            And wait for 10 seconds
            Then an alert should be shown
            And the text in the should be "yay"



