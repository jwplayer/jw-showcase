Feature: Feed page
  The feed page will show all video's from the given feed in a grid overview
  It should show the feed title in the header 
  It should be possible to navigate back via the header `back button`
  It should be possible to watch a video from the feed overview

  @mobile @tablet @desktop
  Scenario: As a user I want to see a feed not found page when the feed doesn't exist
    Given I go directly to the "/list/johndoe" page
    When I wait until the page has been loaded
    Then the feed not found page should be visible

  @mobile @tablet @desktop
  Scenario: Feed title is displayed in the header
    Given I go to the "/list/WXu7kuaW" page
    And I wait until the page has been loaded
    When I do nothing
    Then the title in the toolbar should be "Featured Trailers"

  @mobile @tablet @desktop
  Scenario: Navigate back via the header `back button`
    Given I am still on the "/list/WXu7kuaW" page
    When I click on the back button in the toolbar
    Then I should navigate to the "index" page

  @mobile @tablet @desktop
  Scenario: Watch video from the overview
    Given I go to the "/list/WXu7kuaW" page
    When I click on the first video in the grid overview
    Then I should navigate to the "/list/WXu7kuaW/video/DqGECHhT/central-intelligence" page
