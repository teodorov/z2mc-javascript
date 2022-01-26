// MIT License

// Copyright (c) 2022 Ciprian Teodorov

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { LinearScanHashSet      } from "../datastructures/linear_scan_set.js"
import { PingPongCircularBuffer } from "../datastructures/pingpong_unbounded_circular_buffer.js";
import { dataless_predicate_mc  } from "./z_dataless_predicate_mc.js"

export {hashset_predicate_mc_simple, hashset_predicate_mc_full}

function hashset_predicate_mc_full(tr, acceptingPredicate, hashFn, equalityFn, bound, canonize) {

    let known       = new LinearScanHashSet(1024, hashFn, equalityFn, false);
    let frontier    = new PingPongCircularBuffer(1024);
    let parentTree  = new LinearScanHashSet(1024, hashFn, equalityFn, true); 

    return dataless_predicate_mc(tr, acceptingPredicate, known, frontier, parentTree, bound, canonize);
}

function hashset_predicate_mc_simple(tr, acceptingPredicate, bound) {

    let hashFn      = (c) => tr.configurationHashFn(c);
    let equalityFn  = (a,b)=>tr.configurationEqFn(a,b);
    let known       = new LinearScanHashSet(1024, hashFn, equalityFn, false);
    let frontier    = new PingPongCircularBuffer(1024);
    let parentTree  = new LinearScanHashSet(1024, hashFn, equalityFn, true); 
    let canonize    = (c) => c;                         //identity

    return dataless_predicate_mc(tr, acceptingPredicate, known, frontier, parentTree, bound, canonize);
}

/*

//TODO: implement a real bloom-filter
function bloom_predicate_mc(tr, acceptingPredicate, hashFn, bound, canonize) {

    let known       = new BloomFilter(1024);
    let frontier    = new PingPongCircularBuffer(1024);
    let parentTree  = new LinearScanHashSet(1024, hashFn, equalityFn, true); 

    return dataless_predicate_mc(tr, acceptingPredicate, known, frontier, parentTree, bound, canonize);
}

//TODO: implement a real BDD
// marshaller should be something that transforms a configuration in a boolean array (maybe the SLI marshaller and we handle it here ?)
function bdd_predicate_mc(tr, acceptingPredicate, marshaller, bound, canonize) {

    let known       = new BDD(1024);
    let frontier    = new PingPongCircularBuffer(1024);
    let parentTree  = new LinearScanHashSet(1024, hashFn, equalityFn, true); 
    let bdd_canonize = (c) => project(canonize(c))
    return dataless_predicate_mc(tr, acceptingPredicate, known, frontier, parentTree, bound, bdd_canonize);
}

//TODO: implement a real minimal DFA
// marshaller should be something that can iterate over the configuration contents to produce an array of letters for the DFA.
function dfa_predicate_mc(tr, acceptingPredicate, configuration_iterator, bound, canonize) {

    let known       = new MinimalDFA(1024);
    let frontier    = new PingPongCircularBuffer(1024);
    let parentTree  = new LinearScanHashSet(1024, hashFn, equalityFn, true); 
    let dfa_canonize = (c) => configuration_iterator(canonize(c))
    return dataless_predicate_mc(tr, acceptingPredicate, known, frontier, parentTree, bound, canonize);
}

 */