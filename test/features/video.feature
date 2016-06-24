Feature: Video page

  @tablet @desktop @mobile
  Scenario: As a user I want to see a 404 page when the video doesn't exist
    Given I go directly to the "/video/not/existingVideo" page
    When I wait until the page has been loaded
    Then the 404 page should be visible

  @tablet @desktop @mobile
  Scenario: The video that has been marked for testing exists
    Given I go to the "/video/lrYLc95e/Iyfst4Se" page
    When I wait until the page has been loaded
    Then the video exists

  @mobile @tablet @desktop
   Scenario: As a user I want to see the play icon
    Given I am still on the "/video/lrYLc95e/Iyfst4Se" page
    When I do nothing
    Then the play icon should be visible

  @mobile @tablet @desktop
  Scenario: As a user I want to see the video duration
    Given I am still on the "/video/lrYLc95e/Iyfst4Se" page
    When I do nothing
    Then the video description should show the duration

  @tablet @desktop
  Scenario: As a user I want to see the video title and description over the video
    Given I am still on the "/video/lrYLc95e/Iyfst4Se" page
    When I do nothing
    Then the video title and description should be visible over the video

  @mobile
  Scenario: As a user I want to see the video title and description below the video
    Given I am still on the "/video/lrYLc95e/Iyfst4Se" page
    When I wait until the page has been loaded
    Then the video title and description should be visible below the video

  @mobile @tablet @desktop
  Scenario: As a user I want to see the More like this title
    Given I am still on the "/video/lrYLc95e/Iyfst4Se" page
    When I wait until the page has been loaded
    Then the related videos title is shown

  @mobile @tablet @desktop
  Scenario: As a user I want to be able to navigate back to the dashboard by clicking the back button
    Given I am still on the "/video/lrYLc95e/Iyfst4Se" page
    When I wait until the page has been loaded
    And I click on the navigate back chevron
    Then the index loads

  @tablet @desktop
  Scenario: As a user I want to be able to start the video by clicking the play icon
    Given I go to the "/video/lrYLc95e/Iyfst4Se" page
    When I wait until the page has been loaded
    And I click on the play video icon
    Then the video should be playing

  @desktop
  Scenario: As a user I want the video information to reappear when I move my mouse over the playing video
    Given I am still on the "/video/lrYLc95e/Iyfst4Se" page
    When I wait until the overlay disappears
    And I move my mouse over the video
    Then the video title and description should be visible over the video

  @tablet @desktop
  Scenario: As a user I want the video to pause when it is playing
    Given I am still on the "/video/lrYLc95e/Iyfst4Se" page
    When I click on the playing video
    Then the video should be paused
    And the video title and description should be visible over the video

  @mobile @tablet @desktop
  Scenario: As a user I want to be able to share the video on Facebook
    Given I go to the "/video/lrYLc95e/Iyfst4Se" page
    When I wait until the page has been loaded
    Then the "facebook" share button should contain the correct href

  @mobile @tablet @desktop
  Scenario: As a user I want to be able to share the video on Twitter
    Given I go to the "/video/lrYLc95e/Iyfst4Se" page
    When I wait until the page has been loaded
    Then the "twitter" share button should contain the correct href