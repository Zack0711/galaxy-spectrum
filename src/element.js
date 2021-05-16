import { arrayParse } from './utilities/csv'

import elementH from './csv/elem-H.csv'
import elementHe from './csv/elem-He.csv'
import elementHe_II from './csv/elem-He_II.csv'
import elementO from './csv/elem-O.csv'
import elementO_I from './csv/elem-O_I.csv'
import elementO_II from './csv/elem-O_II.csv'
import elementO_III from './csv/elem-O_III.csv'

const element = {
  list: [ 'H', 'He', 'He_II', 'O', 'O_I', 'O_II', 'O_III'],
  data: {
    H: arrayParse(elementH),
    He: arrayParse(elementHe),
    He_II: arrayParse(elementHe_II),
    O: arrayParse(elementO),
    O_I: arrayParse(elementO_I),
    O_II: arrayParse(elementO_II),
    O_III: arrayParse(elementO_III),
  }
}

const elementMeasurement  = {
  list: ['H_epsilon', 'H_delta', 'H_gamma', 'H_beta', 'H_alpha', 'He_I', 'He_II', 'O_I', 'O_II', 'O_III', 'Ne_III', 'S_II', 'S_III', 'Ar_III', 'N_II'],
  data: {
    H_epsilon: [3890.2],
    H_delta: [4102.9],
    H_gamma: [4341.7],
    H_beta: [4862.7],
    H_alpha: [6564.6],
    He_I: [5877.3],
    He_II: [4687.0, 5413.0],
    O_I: [5578.9, 6302.0, 6365.5],
    O_II: [3727.1, 3729.9],
    O_III: [4364.4, 4960.3, 5008.2],
    Ne_III: [3869.9, 3971.1],
    S_II: [6718.3, 6732.7],
    S_III: [6313.8],
    Ar_III: [7137.8],
    N_II: [5756.2, 6585.3, 6549.9]
  }
}

/*
[O_I] 5578.9  0.0005217 129.6 -14.84  75.74
[O_I] 6302.0  0.0005217 129.6 47.47 64.15
[O_I] 6365.5  0.0005209 129.6 6.936 64.05

[O_II]  3727.1  0.0005206 129.6 -30.87  76.13
[O_II]  3729.9  0.0005206 129.6 2.728 71.12

[O_III] 4364.4  0.0005207 129.6 -9.579  94.45
[O_III] 4960.3  0.0005197 129.6 -3.488  88.76
[O_III] 5008.2  0.0005206 129.6 -10.56  85.3

[Ne_III]  3869.9  0.0005206 129.6 13.38 92.58
[Ne_III]  3971.1  0.0005207 129.6 -57.04  75.48

H_epsilon 3890.2  0.0005207 80.51 -26.71  82.93
H_delta 4102.9  0.0005207 80.51 -23.63  88.89
H_gamma 4341.7  0.0005207 80.51 -18.35  88.51
H_alpha 6564.6  0.0005204 80.51 -19.66  57.81
H_beta  4862.7  0.0005209 80.51 -18.56  81.19

He_I  5877.3  0.0005197 129.6 -9.326  72.12

He_II 4687.0  0.0005207 129.6 -7.762  93.25
He_II 5413.0  0.0005208 129.6 -1.96 78.76

[N_II]  5756.2  0.0005212 129.6 8.707 73.47
[N_II]  6585.3  0.0005197 129.6 -3.484  58.83
[N_II]  6549.9  0.0005209 129.6 -1.892  57.49

[S_II]  6718.3  0.0005207 129.6 8.431 58.54
[S_II]  6732.7  0.0005211 129.6 4.695 57.99

[S_III] 6313.8  0.0005203 129.6 4.148 63.48

[Ar_III]  7137.8
*/

export {
  element,
  elementMeasurement,
}
