// Copyright 2002-2011, University of Colorado

/*
 * CVS Info -
 * Filename : $Source$
 * Branch : $Name$
 * Modified by : $Author: samreid $
 * Revision : $Revision: 47772 $
 * Date modified : $Date: 2011-01-07 12:53:07 -0700 (Fri, 07 Jan 2011) $
 */
package edu.colorado.phet.photoelectric.view;

import edu.colorado.phet.photoelectric.model.util.BeamIntensityMeter;
import edu.colorado.phet.photoelectric.model.util.ScalarDataRecorder;

import javax.swing.*;
import java.awt.*;
import java.text.DecimalFormat;

/**
 * AmmeterView
 *
 * @author Ron LeMaster
 * @version $Revision: 47772 $
 */
public class IntensityView extends JPanel {

    private JTextField intensityTF;
    private DecimalFormat format = new DecimalFormat( "#0.0000" );

    public IntensityView( final BeamIntensityMeter beamIntensityMeter ) {
        setLayout( new GridLayout( 1, 2 ) );
        add( new JLabel( "Intensity: " ) );
        intensityTF = new JTextField( 10 );
        add( intensityTF );

        beamIntensityMeter.addUpdateListener( new ScalarDataRecorder.UpdateListener() {
            public void update( ScalarDataRecorder.UpdateEvent event ) {
                double current = beamIntensityMeter.getIntesity();
                intensityTF.setText( format.format( current ) );
            }
        } );
    }
}
