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
    And I wait until the page is "/search/trailer"
    Then the search page should show 6 items
    And the page title should be "trailer - JW Showcase"

  @mobile @tablet @desktop
  Scenario: As a user I want to be able to play a video from the search results
    Given I go to the "index" page
    When I click on the search button in the header
    And I click on the search input
    And I type "trailer" in the search input
    And I wait until the page is "/search/trailer"
    And I click on the first video in the grid overview
    And I wait until the page is "/search/trailer/video/Iyfst4Se/spotlight"
    Then the page should be "/search/trailer/video/Iyfst4Se/spotlight"

  @mobile @tablet @desktop
  Scenario: As a user I want to be able to share the search overview by a link
    Given I go to the "/search/trailer" page
    Then the search page should show 6 items
    And the page title should be "trailer - JW Showcase"

  @mobile @tablet @desktop
  Scenario: As a user I want to be see when the search results are empty
    Given I go to the "/search/give+me+nothing" page
    Then the search page should show 0 items
    And the page title should be "give me nothing - JW Showcase"
    And the content title should be "Nothing could be found, try changing your search phrase"

  @mobile @tablet @desktop
  Scenario: As a user I don't want to see the search button when no searchPlaylist is defined
    Given I set the configLocation to "./fixtures/config/noSearch.json"
    And I go to the "index" page
    Then the search button should not be visible

  @mobile @tablet @desktop
  Scenario: As a user I want to see all videos when global search is enabled
    Given I set the configLocation to "./fixtures/config/globalSearch.json"
    And I go to the "/search/trailer" page
    Then the search page should show 10 items

  @mobile @tablet @desktop
  Scenario: As a user I want to be able to watch a video from the global search
    Given I set the configLocation to "./fixtures/config/globalSearch.json"
    And I go to the "/search/trailer/video/GQlE6Rqd/2001-a-space-odyssey" page
    Then the page should be "/search/trailer/video/GQlE6Rqd/2001-a-space-odyssey"

  @tablet @desktop
  Scenario: As a user I want to be able to to toggle invideo search
    Given I set the configLocation to "./fixtures/config/globalSearch.json"
    And I go to the "/search/caption" page
    When I click on the invideo search toggle
    Then a result with invideo results should show
    And the show more buttons should be visible

  @tablet @desktop
  Scenario: As a user I want to hover an invideo search occurrence
    Given I set the configLocation to "./fixtures/config/globalSearch.json"
    And I go to the "/search/caption" page
    When I click on the invideo search toggle
    And I hover on the first invideo search dot
    Then The description text should be "Caption two"

  @tablet @desktop
  Scenario: As a user I want to click on an invideo search occurrence
    Given I set the configLocation to "./fixtures/config/globalSearch.json"
    And I go to the "/search/caption" page
    When I click on the invideo search toggle
    And I click on the 6th invideo search dot
    Then the page should be "/search/caption/video/RltV8MtT/the-bfg"
