# Kg-Acw-App

[![Build Status](https://travis-ci.org/harryho/kg-acw-app.svg?branch=master)](https://travis-ci.org/harryho/kg-acw-app)
[![Coverage Status](https://coveralls.io/repos/github/harryho/kg-acw-app/badge.svg?branch=master)](https://coveralls.io/github/harryho/kg-acw-app?branch=master)

It is a repository of kg acw app

## Features

* Using the provided (paginated) API, find the average cubic weight for all products in the "Air Conditioners" category.
* Cubic weight is calculated by multiplying the length, height and width of the parcel. The result is then multiplied by the industry standard cubic weight conversion factor of 250.
* It is a simple command line app. 


## Build & Test

```
# Install babel
npm install babel -g

# Install packages
npm install


# Development
npm run dev

# You may see this on your terminal

==============================================
  Result:
 Average Cubic Weight of Air Conditioners: 41613.38 G


# Run test cases
npm run test


# Run coverage
npm run coverage



