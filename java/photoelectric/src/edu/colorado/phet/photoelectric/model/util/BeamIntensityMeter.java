// Copyright 2002-2011, University of Colorado

/*
 * CVS Info -
 * Filename : $Source$
 * Branch : $Name$
 * Modified by : $Author: samreid $
 * Revision : $Revision: 47772 $
 * Date modified : $Date: 2011-01-07 12:53:07 -0700 (Fri, 07 Jan 2011) $
 */
package edu.colorado.phet.photoelectric.model.util;

import edu.colorado.phet.common.phetcommon.model.clock.IClock;

/**
 * BeamIntensityMeter
 *
 * @author Ron LeMaster
 * @version $Revision: 47772 $
 */
public class BeamIntensityMeter extends ScalarDataRecorder {

    private int clientUpdateInterval = 500;
    private int simulationTimeWindow = 1000;

    public BeamIntensityMeter( IClock clock ) {
        super( clock );
        super.setTimeWindow( simulationTimeWindow );
        super.setClientUpdateInterval( clientUpdateInterval );
    }

    public void recordPhoton() {
        recordPhotons( 1 );
    }

    public void recordPhotons( int numPhotons ) {
        super.addDataRecordEntry( numPhotons );
    }

    public double getIntesity() {
        double intensity = getDataTotal() / getTimeSpanOfEntries();
        if( Double.isNaN( intensity ) || Double.isInfinite( intensity ) ) {
            intensity = 0;
        }
        return intensity;
    }
}
