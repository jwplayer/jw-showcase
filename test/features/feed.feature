Feature: Feed page
  The feed page will show all video's from the given feed in a grid overview
  It should show the feed title in the header 
  It should be possible to navigate back via the header `back button`
  It should be possible to watch a video from the feed overview

  @mobile @tablet @desktop
  Scenario: Feed title is displayed in the header
    Given I go to the "/feed/WXu7kuaW" page
    And I wait until the page has been loaded
    When I do nothing
    Then the header title should be "Featured Trailers"

  @mobile @tablet @desktop
  Scenario: Navigate back via the header `back button`
    Given I am still on the "/feed/WXu7kuaW" page
    When I click on the header back button
    Then I should navigate to the "index" page

  @mobile @tablet @desktop
  Scenario: Watch video from the overview
    Given I go to the "/feed/WXu7kuaW" page
    When I click on the first video in the grid overview
    Then I should navigate to the "/video/WXu7kuaW/DqGECHhT" page
