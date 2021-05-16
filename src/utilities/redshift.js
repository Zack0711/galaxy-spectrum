const airToVac = lambda => {
    //
    // Don't convert less than 2000.
    //
    if (lambda < 2000.0) return lambda;
    let lambda_vac = lambda;
    for ( let iter = 0; iter < 2; iter++ ) {
        const sigma2 = (1.0e4/lambda_vac)*(1.0e4/lambda_vac);
        const fact = 1.0 + 5.792105e-2/(238.0185 - sigma2) + 1.67917e-3/(57.362 - sigma2);
        lambda_vac = lambda*fact;
    }
    return lambda_vac;
}

const redshiftCalibration = (lambda, redshift) => airToVac(lambda)*(1 + redshift)

//shiftedWave = airtovac(lines[i].lambda)*window.redshift

export {
  airToVac,
  redshiftCalibration,
}