Feature: Search
  It should open the search bar when clicking the search button in the header

  @mobile @tablet @desktop
  Scenario: As a user I want to see the search bar when clicking on the search button
    Given I go to the "index" page
    When I click on the search button in the header
    Then the search bar should be visible

  @mobile @tablet @desktop
  Scenario: As a user I want to be able to close the search bar by clicking the close button
    Given I am still on the "index" page
    When I click on the close search button
    Then the search bar should not be visible

  @mobile @tablet @desktop
  Scenario: As a user I want to be able to close the search bar by pressing escape
    Given I am still on the "index" page
    When I click on the search button in the header
    And I click on the search input
    And I press the "ESCAPE" key
    Then the search bar should not be visible

  @mobile @tablet @desktop
  Scenario: As a user I want to be able to search
    Given I am still on the "index" page
    When I click on the search button in the header
    And I click on the search input
    And I type "trailer" in the search input
    And I wait until the page is "/search?q=trailer"
    Then the search page should show 6 items
    And the page title should be "trailer - JW Showcase"

  @mobile @tablet @desktop
  Scenario: As a user I want to be able to play a video from the search results
    Given I go to the "index" page
    When I click on the search button in the header
    And I click on the search input
    And I type "trailer" in the search input
    And I wait until the page is "/search?q=trailer"
    And I click on the first video in the grid overview
    And I wait until the page is "/list/lrYLc95e/video/Iyfst4Se/spotlight"
    Then the page should be "/list/lrYLc95e/video/Iyfst4Se/spotlight"

  @mobile @tablet @desktop
  Scenario: As a user I want to be able to share the search overview by a link
    Given I go to the "/search?q=trailer" page
    Then the search page should show 6 items
    And the page title should be "trailer - JW Showcase"

  @mobile @tablet @desktop
  Scenario: As a user I want to be see when the search results are empty
    Given I go to the "/search?q=nothing" page
    Then the search page should show 0 items
    And the page title should be "nothing - JW Showcase"
    And the content title should be "Nothing could be found, try changing your search phrase"

  @mobile @tablet @desktop
  Scenario: As a user I don't want to see the search button when no searchPlaylist is defined
    Given I set the configLocation to "./fixtures/config/noSearch.json"
    Given I go to the "index" page
    Then the search button should not be visible
