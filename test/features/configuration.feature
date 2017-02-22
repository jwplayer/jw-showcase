Feature: Configuration

  @mobile @tablet @desktop
  Scenario: I use the default config file
    Given I go to the "index" page
    When I wait until the page has been loaded
    Then the logo should use "images/logo.png" as src
    And the theme should be "light"
    And the title should be "JW Showcase"
    And the description should be "JW Showcase is an open-source, dynamically generated video website built around JW Player and JW Platform services. It enables you to easily publish your JW Player-hosted video content with no coding and minimal configuration."
    And the footer text should be "Powered by JW Player"

  @mobile @tablet @desktop
  Scenario: I use a custom config file
    Given I set configLocation to "./fixtures/config/customConfig.json"
    And I go to the "index" page
    When I wait until the page has been loaded
    Then the logo should use "/fixtures/jwplayer-logo.png" as src
    And the theme should be "dark"
    And the title should be "Custom siteName"
    And the description should be "Custom description"
    And the footer text should be "Custom footer"

  @mobile @tablet @desktop
  Scenario: I use an invalid config file
    Given I set configLocation to "./fixtures/config/invalidConfig.json"
    And I go to the "index" page
    When I wait until the page has been loaded
    Then I should see an error with message "Failed to load config file"

  @mobile @tablet @desktop
  Scenario: I use an non existing config file
    Given I set configLocation to "./fixtures/config/notthere.json"
    And I go to the "index" page
    When I wait until the page has been loaded
    Then I should see an error with message "Failed to load config file"

  @tablet @desktop
  Scenario: I don't want to use the featured slider
    Given I set configLocation to "./fixtures/noFeaturedPlaylistConfig.json"
    And I go to the "index" page
    When I do nothing
    Then the featured slider should not be visible

  @mobile
  Scenario: I don't want to use the featured slider
    Given I set configLocation to "./fixtures/noFeaturedPlaylistConfig.json"
    And I go to the "index" page
    When I do nothing
    Then the featured items should not be visible

  @mobile @tablet @desktop
  Scenario: I don't want to use the default sliders
    Given I set configLocation to "./fixtures/noPlaylistsConfig.json"
    And I go to the "index" page
    When I do nothing
    Then the default sliders should not be visible
