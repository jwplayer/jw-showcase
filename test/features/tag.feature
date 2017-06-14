Feature: Tag page
  The tag page will show all video's from the given tag in a grid overview
  It should show the tag title in the header
  It should be possible to navigate back via the header `back button`
  It should be possible to watch a video from the tag overview

  @mobile @tablet @desktop
  Scenario: Tag title is displayed in the header
    Given I go to the "/tag/drama" page
    And I wait until the page has been loaded
    When I do nothing
    Then the title in the toolbar should be "drama"

  @mobile @tablet @desktop
  Scenario: Navigate back via the header `back button`
    Given I am still on the "/tag/drama" page
    When I click on the back button in the toolbar
    Then I should navigate to the "index" page

  @mobile @tablet @desktop
  Scenario: Watch video from the overview
    Given I go to the "/tag/drama" page
    When I click on the first video in the grid overview
    Then I should navigate to the "/list/lrYLc95e/video/Iyfst4Se/spotlight" page
