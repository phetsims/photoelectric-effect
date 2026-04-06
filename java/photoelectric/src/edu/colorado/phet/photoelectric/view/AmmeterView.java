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

import edu.colorado.phet.photoelectric.model.Ammeter;
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
public class AmmeterView extends JPanel {

    private JTextField currentTF;
    private DecimalFormat format = new DecimalFormat( "#0.0000" );

    public AmmeterView( final Ammeter ammeter ) {
        this( ammeter, true );
    }

    public AmmeterView( final Ammeter ammeter, boolean horizontal ) {
        LayoutManager layout = horizontal ? new GridLayout( 1, 2 ) : new GridLayout( 2, 1 );
        JPanel currentPanel = new JPanel( layout );
        currentPanel.add( new JLabel( "Current: " ) );
        currentTF = new JTextField( 6 );
        currentPanel.add( currentTF );
        add( currentPanel );

        ammeter.addUpdateListener( new ScalarDataRecorder.UpdateListener() {
            public void update( ScalarDataRecorder.UpdateEvent event ) {
                double current = ammeter.getCurrent();
                currentTF.setText( format.format( current ) );
            }
        } );
    }
}
