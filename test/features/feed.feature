Feature: Feed page
  The feed page will show all video's from the given feed in a grid overview
  It should show the feed title in the header 
  It should be possible to navigate back via the header `back button`
  It should be possible to watch a video from the feed overview

  @mobile @tablet @desktop
  Scenario: As a user I want to see a feed not found page when the feed doesn't exist
    Given I go to the "/list/johndoe" page
    Then the page should be "/feed-not-found"
    And the subheader title should be "This feed doesn't exist"

  @mobile @tablet @desktop
  Scenario: Feed title is displayed in the header
    Given I go to the "/list/WXu7kuaW" page
    Then the subheader title should be "Featured Trailers"

  @mobile @tablet @desktop
  Scenario: Navigate back via the header `back button`
    Given I am still on the "/list/WXu7kuaW" page
    When I click on the back button in the toolbar
    Then the page should be "index"

  @mobile @tablet @desktop
  Scenario: Watch video from the overview
    Given I go to the "/list/WXu7kuaW" page
    When I click on the first video in the grid overview
    Then the page should be "/list/WXu7kuaW/video/DqGECHhT/central-intelligence"
