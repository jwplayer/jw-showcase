Feature: Dashboard page
  The dashboard page should show one featured slider and multiple default sliders based on the configuration
  It should show a featured card slider for tablet and desktop users
  It should show featured cards vertically for mobile users
  It should show default card sliders
  It should be possible to slide the cards inside the slider

  @tablet @desktop
  Scenario: As a user I want to see the featured slider
    Given I go to the "index" page
    When I do nothing
    Then the featured slider should be visible

  @mobile
  Scenario: As a user I want to see featured items
    Given I go to the "index" page
    When I do nothing
    Then there should be featured items visible

  @mobile @tablet @desktop
  Scenario: As a user I want to see the default sliders
    Given I am still on the "index" page
    When I do nothing
    Then there should be "3" default sliders visible

  @tablet @desktop
  Scenario: As a user I want to be able to navigate forward through the featured feed
    Given I go to the "index" page
    When I wait until the page has been loaded
    And I click the right arrow in the featured slider
    Then the first item in the featured slider should not be visible

  @tablet @desktop
  Scenario: As a user I want to be able to navigate backward through a featured feed
    Given I am still on the "index" page
    When I click the left arrow in the featured slider
    Then the first item in the featured slider should be visible

  @mobile @tablet
  Scenario: As a user I want to be able to navigate forward through a featured feed by swiping
    Given I go to the "index" page
    When I wait until the page has been loaded
    And I scroll to the first default slider
    And I swipe left in the first default slider
    Then the first item in the featured slider should not be visible

  @mobile @tablet
  Scenario: As a user I want to be able to navigate backward through the featured feed by swiping
    Given I am still on the "index" page
    When I wait until the page has been loaded
    And I scroll to the first default slider
    And I swipe right in the first default slider
    Then the first item in the featured slider should be visible

  @tablet @desktop
  Scenario: As a user I want to see when I can't slide to the left
    Given I am still on the "index" page
    When I do nothing
    Then the "left" arrow in the first default slider should be disabled

  @tablet @desktop
  Scenario: As a user I want to see the active indicator in the featured slider
    Given I am still on the "index" page
    When I do nothing
    Then the indicator should highlight the first bullet

  @mobile @tablet @desktop
  Scenario: As a user I want to see the title with video count of the first default slider
    Given I am still on the "index" page
    When I wait until the page has been loaded
    And I scroll to the first default slider
    Then the title of the first default slider should be "Featured Trailers (8)"

  @mobile @tablet @desktop
  Scenario: As a user I want to see the title with video count of the second default slider
    Given I am still on the "index" page
    And I scroll to the second default slider
    When I wait until the page has been loaded
    Then the title of the second default slider should be "Comedy (5)"

  @mobile @tablet @desktop
  Scenario: As a user I want to see the title of the items in the default sliders
    Given I go to the "index" page
    When I wait until the page has been loaded
    And I scroll to the first default slider
    Then the titles of the items should be visible

  @tablet @desktop
  Scenario: As a user I want to see the title and description of the visible item in the featured feed
    Given I am still on the "index" page
    When I wait until the page has been loaded
    And I scroll to the featured default slider
    Then the title and description should be visible in the featured slider

  @desktop
  Scenario: As a user I want to see the description and duration in the default feeds on mouse hover
    Given I am still on the "index" page
    When I scroll to the first default slider
    And I move my mouse to the first item in the default slider
    Then I should see the description in the default slider
    And I should see the duration in the default slider

  @mobile
  Scenario: As a user I want to be able to navigate to the video page by clicking on the first featured item
    Given I go to the "index" page
    When I wait until the page has been loaded
    And I click the first featured item in the dashboard
    Then I should navigate to the "video" page

  @tablet @desktop
  Scenario: As a user I want to be able to navigate to the video page by clicking on the first featured item
    Given I go to the "index" page
    When I wait until the page has been loaded
    And I click the first item in the featured slider
    Then I should navigate to the "video" page

  @desktop
  Scenario: As a user I want to be able to navigate to the video page and start the video by clicking on the item play icon
    Given I go to the "index" page
    When I wait until the page has been loaded
    And I click the play icon in the visible item in the featured slider
    Then I should navigate to the "video" page
    And the video should be playing