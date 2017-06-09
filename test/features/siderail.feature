Feature: Siderail

    @tablet @desktop @mobile @new
    Scenario: As a user I want to see a siderail
        Given I set configLocation to "./fixtures/config/siderail.json"
        And I go directly to the "/list/lrYLc95e/video/Iyfst4Se/" page
        When I wait until the page has been loaded
        Then the siderail should be visible

    @mobile @tablet @desktop @new
    Scenario: As a user I want to see a siderail title
        Given I am still on the "/list/lrYLc95e/video/Iyfst4Se/" page
        When I wait until the page has been loaded
        Then the siderail title should be visible

    @mobile @tablet @desktop @new
    Scenario: As a user I want to see  siderailitems
        Given I am still on the "/list/lrYLc95e/video/Iyfst4Se/" page
        When I wait until the page has been loaded
        Then there should be siderailitems in the siderail

    @mobile @tablet @desktop @new
    Scenario: As a user I want to see a siderailitem have a poster
        Given I am still on the "/list/lrYLc95e/video/Iyfst4Se/" page
        When I wait until the page has been loaded
        Then the 1st siderailitem should have a poster

    @mobile @tablet @desktop @new
    Scenario: As a user I want to see a siderailitem have a title
        Given I am still on the "/list/lrYLc95e/video/Iyfst4Se/" page
        When I wait until the page has been loaded
        Then the 1st siderailitem should have a title

