# SOLID Principles

The SOLID principles are five design rules for writing clean, maintainable, and scalable object-oriented code

## Single Responsibility Principle (SRP)

A class must have only one reason to change. Separation of concerns.
e.g. `UserModel` class should only handle database operations. It should not send email notifications or format JSON data

## Open/Closed Principle (OCP)

Open for Extension, but Closed for Modification. Achieved via interfaces and abstract classes.

e.g. If you need to add a new payment method (eg. Crypto), create a new class implementing a `Payment` interface instead of editing the existing `PaymentProcessor` class with nested if-else statements.

## Liskov Substitution Principle (LSP)

Child class must extend capability of parent class not narrow it down

e.g. If parent Bird has a `fly()` method, creating a `Ostrich` subclass that throws an error when `fly()` is called violates LSP

## Interface Segregation Principle (ISP)

Interfaces should be such that, client should not implement unecessary functions they do not need. Bigger interfaces should be broken down into smaller, role-specific interfaces.

e.g. Instead of a giant Worker interface with `cook()` and `drive()`, split it into `Cookable` and `Drivable` interfaces.

## Dependency Inversion Principle (DIP)

High-level modules should not depend on low-level modules, both should depend on abstractions (interfaces). Program to an interface, not an implementation.

e.g. A high-level `NotificationService` should depend on an `EmailProvider` interface, not the concrete `SendGridAPI` class directly.
