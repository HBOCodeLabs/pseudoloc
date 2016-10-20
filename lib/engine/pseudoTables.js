/**
 * @preserve Copyright (c) 2015 Home Box Office, Inc. as an unpublished
 * work. Neither this material nor any portion hereof may be copied or
 * distributed without the express written consent of Home Box Office, Inc.
 *
 * This material also contains proprietary and confidential information
 * of Home Box Office, Inc. and its suppliers, and may not be used by or
 * disclosed to any person, in whole or in part, without the prior written
 * consent of Home Box Office, Inc.
 */

'use strict';

var tables = {};

// Latin/Greek/Cyrilic character replacement
// These characters are generally considered "normal" width
// Source: too long looking at http://unicode-table.com/en/
tables.latin = {
    A: ['Ā', 'Ă', 'Ą', 'Ǎ', 'Ʌ'],
    a: ['ā', 'ă', 'ą', 'ǎ', 'ǟ'],
    B: ['Ɓ', 'ß', 'ʙ'],
    b: ['ƀ', 'Ƃ', 'ƃ', 'Ƅ'],
    C: ['Ć', 'Ĉ', 'Ċ', 'Č', 'Ƈ'],
    c: ['ć', 'ĉ', 'ċ', 'č', 'ƈ'],
    D: ['Ď', 'Đ', 'Ɖ', 'Ɗ'],
    d: ['ď', 'đ', 'Ƌ', 'ƌ'],
    E: ['Ē', 'Ĕ', 'Ė', 'Ę', 'Ě'],
    e: ['ē', 'ĕ', 'ė', 'ę', 'ě'],
    F: ['Ƒ'],
    f: ['ƒ'],
    G: ['Ĝ', 'Ğ', 'Ġ', 'Ģ', 'Ɠ', 'Ǥ'],
    g: ['ĝ', 'ğ', 'ġ', 'ģ', 'ǥ', 'ɠ'],
    H: ['Ĥ', 'Ħ'],
    h: ['ĥ', 'ħ'],
    I: ['Ĩ', 'Ī', 'Ĭ', 'Į', 'Ǐ'],
    i: ['ĩ', 'ī', 'ĭ', 'į', 'ǐ'],
    J: ['Ĵ'],
    j: ['ĵ'],
    K: ['Ķ', 'Ƙ', 'Ǩ'],
    k: ['ķ', 'ĸ', 'ƙ', 'ǩ'],
    L: ['Ĺ', 'Ļ', 'Ľ', 'Ŀ', 'Ł'],
    l: ['ĺ', 'ļ', 'ľ', 'ŀ', 'ł'],
    M: ['ʍ', 'Μ'],
    m: ['ɱ'],
    N: ['Ń', 'Ņ', 'Ň', 'Ɲ', 'ɴ'],
    n: ['ń', 'ņ', 'ň', 'ŉ', 'ŋ', 'ƞ', 'ɲ', 'ή'],
    O: ['Ō', 'Ŏ', 'Ő', 'Ǒ'],
    o: ['ō', 'ŏ', 'ő', 'ǒ'],
    P: ['Ƥ'],
    p: ['ƥ', 'ƿ'],
    Q: ['Ǫ', 'Ǭ'],
    q: ['ɋ'],
    R: ['Ŕ', 'Ŗ', 'Ř', 'Ʀ'],
    r: ['ŕ', 'ŗ', 'ř'],
    S: ['Ś', 'Ŝ', 'Ş', 'Š', 'Ƨ'],
    s: ['ś', 'ŝ', 'ş', 'š', 'ƨ'],
    T: ['Ţ', 'Ť', 'Ŧ', 'Ͳ'],
    t: ['ţ', 'ť', 'ŧ'],
    U: ['Ũ', 'Ū', 'Ŭ', 'Ů', 'Ű', 'Ų'],
    u: ['ũ', 'ū', 'ŭ', 'ů', 'ű', 'ų'],
    V: ['Ѵ'],
    v: ['ɣ'],
    W: ['Ŵ', 'Ɯ', 'Ŵ'],
    w: ['ŵ', 'ɯ', 'ŵ'],
    X: ['Χ'],
    x: ['χ', 'ϰ'],
    Y: ['Ŷ', 'Ÿ', 'ʏ', 'Ɏ'],
    y: ['ŷ', 'ɏ'],
    Z: ['Ź', 'Ż', 'Ž', 'Ƶ'],
    z: ['ź', 'ż', 'ž', 'ƶ'],
};

// Asian character replacement.
// These characters are generally considered "wide" characters
// Source: http://www.omniglot.com/conscripts/swc.htm
// Source: http://goodcharacters.com/alphabet/alphabetweb.php
tables.asian = {
    A: ['月', '亼', '亽'],
    a: ['月', '亼', '亽'],
    B: ['官', '㠯', '乃'],
    b: ['官', '㠯', '乃'],
    C: ['亡', '匹'],
    c: ['亡', '匹'],
    D: ['刀'],
    d: ['刀'],
    E: ['王', '巳', '三'],
    e: ['王', '巳', '三'],
    F: ['干', '下'],
    f: ['干', '下'],
    G: ['五', '巨'],
    g: ['五', '巨'],
    H: ['什', '廾', '升'],
    h: ['什', '廾', '升'],
    I: ['工'],
    i: ['工'],
    J: ['丁', '了'],
    j: ['丁', '了'],
    K: ['片', '水'],
    k: ['片', '水'],
    L: ['辶', '心'],
    l: ['辶', '心'],
    M: ['冊', '朋'],
    m: ['冊', '朋'],
    N: ['內'],
    n: ['內'],
    O: ['口'],
    o: ['口'],
    P: ['戶', '尸'],
    p: ['戶', '尸'],
    Q: ['已', '甲'],
    q: ['已', '甲'],
    R: ['尺', '食', '民'],
    r: ['尺', '食', '民'],
    S: ['与', '弓'],
    s: ['与', '弓'],
    T: ['七', '十'],
    t: ['七', '十'],
    U: ['丩', '凵', '臼'],
    u: ['丩', '凵', '臼'],
    V: ['人'],
    v: ['人'],
    W: ['丱', '山'],
    w: ['丱', '山'],
    X: ['乂', '父'],
    x: ['乂', '父'],
    Y: ['入', '了'],
    y: ['入', '了'],
    Z: ['之', '乙'],
    z: ['之', '乙']
};

module.exports = tables;
