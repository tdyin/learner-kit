# Thermodynamics reference set

Maintainer reference material for checking Learner Kit skills. It is not limited to one supported topic. Each problem lists the learner-facing statement first. Expected reasoning and answers are kept separate so the statement can be pasted into a chat without giving away the solution.

This set grows across release slices. Current contents: concept notes, two first-law problems, and common mistakes. To come in later slices: three more problems and a transfer variant.

## Conventions and sources

- **Sign convention:** first law written as ΔU = Q − W, where Q is heat **added to** the system and W is work done **by** the system on its surroundings. This follows OpenStax *University Physics Volume 2*, Chapter 3 ("The First Law of Thermodynamics"), <https://openstax.org/books/university-physics-volume-2/pages/3-introduction>.
  - Chemistry texts often write ΔU = q + w, where w is work done **on** the system. Both give the same physical answer: w = −W. Accept either convention when the learner states it and applies it consistently.
- **Units:** SI. Energy in joules (J), volume in litres (L) or m³, temperature in kelvin (K).
- **Gas constant:** R = 8.314 462 618 153 24 J·mol⁻¹·K⁻¹ (exact under the 2019 SI as N_A·k; CODATA, <https://physics.nist.gov/cgi-bin/cuu/Value?r>). R = 8.314 J·mol⁻¹·K⁻¹ is fine for three significant figures.
- **Verification:** the arithmetic below was recomputed in Python (`math.log`) on 2026-10-01.

## Concept notes

- **Internal energy U** is a state function. ΔU depends only on the initial and final states, not on the path.
- **Heat Q and work W** are energy transfers that depend on the path. A system does not "contain" heat or work.
- **Ideal gas:** U depends only on temperature, so ΔU = 0 for any isothermal process of an ideal gas.
- **Isothermal does not mean adiabatic.** Constant temperature does not mean Q = 0. A gas that expands isothermally must absorb heat to stay at constant T.
- **Reversible isothermal work (ideal gas):** W = nRT ln(V₂/V₁). It is positive for an expansion under the convention above. The logarithm is natural.

## Problems

### P1. First-law bookkeeping

**Learner-facing statement:** A gas in a piston–cylinder absorbs 500 J of heat from a burner. At the same time it pushes the piston out and does 200 J of work on the surroundings. What is the change in the gas's internal energy?

**Expected reasoning:** Heat is added, so Q = +500 J. Work is done by the gas, so W = +200 J. ΔU = Q − W = 500 J − 200 J.

**Answer:** ΔU = **+300 J**. The internal energy increases.

In the ΔU = q + w convention, q = +500 J and w = −200 J, which gives the same +300 J.

### P2. Reversible isothermal expansion (homework walkthrough problem)

**Learner-facing statement:** 2.0 mol of an ideal gas expands isothermally and reversibly at 300 K from 10.0 L to 20.0 L. Find the work done by the gas W, the heat Q, and the change in internal energy ΔU.

**Expected reasoning:**

1. Ideal gas and isothermal, so ΔU = 0.
2. Reversible isothermal work: W = nRT ln(V₂/V₁) = (2.0 mol)(8.314 J·mol⁻¹·K⁻¹)(300 K) ln(20.0/10.0).
3. nRT = 4988.7 J and ln 2 = 0.69315, so W = 3457.9 J ≈ 3.46 kJ (work done by the gas, positive).
4. First law: Q = ΔU + W = 0 + 3.46 kJ.

**Answer:** ΔU = **0**, W = **+3.46 kJ** (by the gas), Q = **+3.46 kJ** (absorbed by the gas). The volumes enter only as a ratio, so litres need no conversion.

**Bounded-hint ladder** (for checking that hints stay bounded):

1. Since an ideal gas's internal energy depends only on temperature, what must ΔU be for this process?
2. For a reversible process, W = ∫P dV. Use the ideal-gas law to write P in terms of V at constant T.
3. Evaluate the integral between V₁ and V₂, then use the first law for Q.

## Common mistakes

| Mistake | What it produces | Where it comes from |
|---|---|---|
| Adding W instead of subtracting it (P1) | ΔU = 700 J | Mixing the Q − W and q + w conventions |
| Setting Q = 0 because "temperature is constant" (P2) | Q = 0, so ΔU = −W | Confusing isothermal with adiabatic |
| Using log₁₀ instead of ln (P2) | W ≈ 1.50 kJ | Calculator habit |
| Using T in °C (P2) | W ≈ 311 J | Not converting to kelvin |
| Assuming ΔU ≠ 0 because the gas "did work" (P2) | Non-zero ΔU | Not using the fact that ideal-gas U depends only on T |
| Reporting W as negative while saying "work done by the gas" (P2) | Sign inconsistent with the stated convention | Unclear about which convention is in use. This is a defensible alternative if the learner explicitly uses w on the system. |
