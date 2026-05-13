/**
 * Wzorce zgodne z `ValidationPatterns` w api-alcozon
 * (`com.alcoholfactory.api.common.validation`) — front odrzuca te same konstrukcje przed wysłaniem żądania.
 */
export const SAFE_TEXT_REGEX = /^[^;'"><{}\[\]\\]*$/;

/** Jak {@code PASSWORD_STRONG} po stronie API (tylko znaki specjalne: @$!%*?&). */
export const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/;
