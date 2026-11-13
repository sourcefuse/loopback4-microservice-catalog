// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
// Controllers here are mounted by the component only when the matching
// AuthServiceBindings.Config flag is set; this folder is outside the dirs the
// component's controller booter scans, so they are never auto-mounted.
export * from './saml-logout.controller';
