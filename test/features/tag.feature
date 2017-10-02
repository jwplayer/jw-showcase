Feature: Tag page
  The tag page will show all video's from the given tag in a grid overview
  It should show the tag title in the header
  It should be possible to navigate back via the header `back button`
  It should be possible to watch a video from the tag overview

  @mobile @tablet @desktop
  Scenario: Tag title is displayed in the header
    Given I go to the "/tag/drama" page
    Then the subheader title should be "drama"

  @mobile @tablet @desktop
  Scenario: Navigate back via the header `back button`
    Given I am still on the "/tag/drama" page
    When I click on the back button in the toolbar
    Then the page should be "index"

  @mobile @tablet @desktop
  Scenario: Watch video from the overview
    Given I go to the "/tag/drama" page
    When I click on the first video in the grid overview
    And I wait until the page is "/LjBvF1FX/the-girl-in-the-book?list=lrYLc95e"
    Then the page should be "/LjBvF1FX/the-girl-in-the-book?list=lrYLc95e"
