Feature: Video page

  @tablet @desktop @mobile
  Scenario: As a user I want to see a video not found page when the video doesn't exist
    Given I go directly to the "/list/lrYLc95e/video/johndoe" page
    When I wait until the page has been loaded
    Then the video not found page should be visible

  @tablet @desktop @mobile
  Scenario: As a user I want to watch a video
    Given I go to the "/list/lrYLc95e/video/Iyfst4Se/" page
    When I wait until the page has been loaded
    Then the video player is ready

  @mobile @tablet @desktop
   Scenario: As a user I want to see the play icon
    Given I am still on the "/list/lrYLc95e/video/Iyfst4Se/" page
    When I do nothing
    Then the play icon should be visible

  @mobile @tablet @desktop
  Scenario: As a user I want to see the video duration
    Given I am still on the "/list/lrYLc95e/video/Iyfst4Se/" page
    When I do nothing
    Then the video details should show the duration

  @mobile @tablet @desktop
  Scenario: As a user I want to see the video title and description below the video
    Given I am still on the "/list/lrYLc95e/video/Iyfst4Se/" page
    When I wait until the page has been loaded
    Then the video title and description should be visible

  @mobile @tablet @desktop
  Scenario: As a user I want to see the More like this title
    Given I am still on the "/list/lrYLc95e/video/Iyfst4Se/" page
    When I wait until the page has been loaded
    And I scroll to the related slider
    Then the related videos title is shown

  @mobile @tablet @desktop
  Scenario: As a user I want to be able to navigate back to the dashboard by clicking the back button
    Given I am still on the "/list/lrYLc95e/video/Iyfst4Se/" page
    When I wait until the page has been loaded
    And I click on the back button in the toolbar
    Then I should navigate to the "index" page

  @desktop @mobile @tablet
  Scenario: As a user I want to be able to start video playback
    Given I go to the "/list/lrYLc95e/video/Iyfst4Se/" page
    When I wait until the page has been loaded
    And wait for 1 seconds
    And I start video playback
    Then the video should be playing